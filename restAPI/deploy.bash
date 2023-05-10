python3 -m venv .venv
pip install --upgrade pip -q -q -q
pip install -r requirements.txt -q -q -q
python python_scripts/deploy_documentation.py

node index.js
