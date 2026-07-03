from celery import Celery
from celery.schedules import crontab

from app.core.config import settings

celery_app = Celery(
    "luma",
    broker=settings.redis_url or "memory://",
    backend=settings.redis_url or "cache+memory://",
    include=["app.worker.tasks"],
)

# Without Redis configured, tasks run eagerly (in-process, synchronous) so the
# pipeline works with zero extra infrastructure in dev.
celery_app.conf.task_always_eager = settings.celery_always_eager
celery_app.conf.task_eager_propagates = True

# Scheduled recap generation (prod: run `celery -A app.worker.celery_app beat`
# alongside a worker; eager dev mode does not schedule).
celery_app.conf.beat_schedule = {
    "weekly-recap": {
        "task": "generate_weekly_summaries",
        "schedule": crontab(hour=9, minute=0, day_of_week="sun"),
    },
}
