// Admin routes
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getCurrencies,
  createCurrency,
  updateCurrency,
  getRates,
  updateRate,
  getUsers,
  createUser,
  updateUserPassword,
  deleteUser,
  getOfficeLocation,
  updateOfficeLocation,
  getSettings,
  updateSettings,
} from '../controllers/adminController';

const router = Router();

// All admin routes require authentication
router.use(authenticate);

// Currencies
router.get('/currencies', getCurrencies);
router.post('/currencies', createCurrency);
router.put('/currencies/:id', updateCurrency);

// Rates
router.get('/rates', getRates);
router.put('/rates/:id', updateRate);

// Users
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:email/password', updateUserPassword);
router.delete('/users/:email', deleteUser);

// Office Location
router.get('/office-location', getOfficeLocation);
router.put('/office-location', updateOfficeLocation);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;

