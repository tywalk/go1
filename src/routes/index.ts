import { Router } from 'express';
import EventRouter from './Events';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/events', EventRouter);

// Export the base-router
export default router;