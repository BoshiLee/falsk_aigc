import os
import configparser


class Config:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls.config_file_path = os.path.join(os.path.dirname(__file__), '..', 'config.ini')
            cls.config = configparser.ConfigParser()
            cls.config.read(cls.config_file_path)

            cls.openai_api_key = cls.config['openai']['api_key']
            cls.model = cls.config['openai']['model']
            cls.secret_key = cls.config['flask']['secret_key']
        return cls._instance
