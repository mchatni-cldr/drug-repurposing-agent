1. To run this demo on Cloudera Data Platform, create a new project in CAI. 
2. In the project, git clone this repository. Make sure all the files are in the /home/cdsw path. 
3. Create an application with 2vCPU and 4GB RAM, and deploy the cml_app.py as the script for the application. 
4. Add ANTHROPIC_API_KEY = <your_key> in environment variables
5. This is a typescript react application front end, with flask API backend.
6. Once the application is in running state, access it from CAI application link. 
7. The build files from dist are in frontend folder, and thats where the front end gets served from (technical detail) 