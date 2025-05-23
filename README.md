# An Educational Quantum Computing System

This project is a fork of Lea Button's Educational Quantum Circuit Simulator which can be found [here](https://github.com/zorbzers/aeqcbas-code). 

I will be further building onto this repo as part of my dissertation project for my BEng Computer Science degree. 


![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black)

## Running The Project Locally
The project repository can be cloned and run locally.

### Prerequisites

- Python 3.8 or higher
- Node.js and npm

### Installation and Set-up
1. **Clone the repository**

   ```bash
   git clone https://github.com/zorbzers/aeqcbas-code.git
   ```
2. **Set up a virtual environment** (recommended)

    From the root of the project directory:
    - Unix:
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    - Windows:
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```

3. **Install required Python packages**
    ```bash
    pip install -r requirements.txt
    ```

4. **Install JavaScript dependencies**
    ```bash
    npm install
    ```

5. **Build static files**
    ```bash
    npm run build
    ```

6. **Apply migrations**

    From the /src directory of the project:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

### Running the Development Server
The server can be started with:
```bash
python manage.py runserver
```
The application will be available at: ```http://127.0.0.1:8000/```.