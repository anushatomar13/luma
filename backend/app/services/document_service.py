from sqlalchemy.orm import Session

from app.models.document import Document


def upsert_sync(
    db: Session, *, user_id: str, kind: str, text: str, embedding: list[float]
) -> None:
    """Sync upsert (used by the Celery worker) of one embedded document."""
    doc = db.query(Document).filter_by(user_id=user_id, kind=kind).first()
    if doc is None:
        db.add(Document(user_id=user_id, kind=kind, text=text, embedding=embedding))
    else:
        doc.text = text
        doc.embedding = embedding
    db.commit()
