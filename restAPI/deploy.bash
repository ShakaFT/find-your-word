sudo apt install python3.11

python3 -m venv .venv
pip install -r requirements.txt
python python_scripts/deploy_documentation.py

node index.js
