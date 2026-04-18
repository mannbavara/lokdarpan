from typing import Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel
from sqlmodel import Session, select

from app.models.base import TimestampMixin

ModelType = TypeVar("ModelType", bound=TimestampMixin)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: type[ModelType]):
        self.model = model

    def get(self, session: Session, id: UUID) -> ModelType | None:
        return session.get(self.model, id)

    def get_multi(self, session: Session, *, skip: int = 0, limit: int = 100) -> list[ModelType]:
        statement = select(self.model).offset(skip).limit(limit)
        return session.exec(statement).all()

    def create(self, session: Session, *, obj_in: CreateSchemaType) -> ModelType:
        db_obj = self.model.model_validate(obj_in)
        session.add(db_obj)
        session.commit()
        session.refresh(db_obj)
        return db_obj

    def update(self, session: Session, *, db_obj: ModelType, obj_in: UpdateSchemaType | dict[str, any]) -> ModelType:
        obj_data = obj_in.model_dump(exclude_unset=True) if isinstance(obj_in, BaseModel) else obj_in
        # db_obj.sqlmodel_update(obj_data)
        for field, value in obj_data.items():
            setattr(db_obj, field, value)
        session.add(db_obj)
        session.commit()
        session.refresh(db_obj)
        return db_obj

    def delete(self, session: Session, *, id: UUID) -> ModelType:
        db_obj = session.get(self.model, id)
        session.delete(db_obj)
        session.commit()
        return db_obj
