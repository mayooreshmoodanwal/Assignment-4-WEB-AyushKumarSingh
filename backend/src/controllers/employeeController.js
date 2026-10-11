const Employee = require('../models/Employee');
const { isValidObjectId } = require('../utils/validation');

const buildQuery = (queryParams) => {
  const filter = {};
  if (queryParams.search) {
    const regex = new RegExp(queryParams.search, 'i');
    filter.$or = [{ name: regex }, { email: regex }, { designation: regex }];
  }
  if (queryParams.department) {
    filter.department = new RegExp(`^${queryParams.department}$`, 'i');
  }
  return filter;
};

const getEmployees = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter = buildQuery(req.query);
    const isAdmin = req.user.role === 'admin';

    const select = isAdmin ? '' : '-salary';

    const [employees, total] = await Promise.all([
      Employee.find(filter).select(select).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Employee.countDocuments(filter),
    ]);

    res.json({
      employees,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const isAdmin = req.user.role === 'admin';
    const select = isAdmin ? '' : '-salary';

    const employee = await Employee.findById(req.params.id).select(select);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ employee });
  } catch (err) {
    next(err);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ employee });
  } catch (err) {
    next(err);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ employee });
  } catch (err) {
    next(err);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const [total, departmentAgg, recent] = await Promise.all([
      Employee.countDocuments(),
      Employee.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]),
      Employee.find().sort({ createdAt: -1 }).limit(5).select('-salary'),
    ]);

    res.json({
      totalEmployees: total,
      totalDepartments: departmentAgg.length,
      departments: departmentAgg,
      recentEmployees: recent,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, getStats };
