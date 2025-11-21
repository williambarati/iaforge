from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongo_uri: str = Field(..., env="MONGO_URI")
    mongo_db: str = Field("iaforge", env="MONGO_DB")
    port: int = Field(8080, env="PORT")

    model_config = {
        "env_file": None,
        "case_sensitive": False,
    }


settings = Settings()
