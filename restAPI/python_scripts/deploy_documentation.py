"""
This script deploys REST API documentation.
"""
import os

from dotenv import load_dotenv
import requests

load_dotenv()

headers = {
    "Authorization": f"Bearer {os.environ['SWAGGER_TOKEN']}",
    "Content-Type": "application/yaml",
}
documentation_data = open("documentation.yaml", "rb").read()

requests.post(
    os.environ["SWAGGER_URL"], headers=headers, data=documentation_data, timeout=300
)
