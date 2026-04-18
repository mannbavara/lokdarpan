"""APScheduler setup for background jobs."""

import logging

from apscheduler.schedulers.background import BackgroundScheduler

logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler = BackgroundScheduler()


def start_scheduler():
    """Start the APScheduler background jobs."""
    if not scheduler.running:
        scheduler.start()
        logger.info("APScheduler started successfully")


def shutdown_scheduler():
    """Shutdown the scheduler gracefully."""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("APScheduler shut down")
