const fs = require('fs');
const path = require('path');

class Projects {

    constructor(con, secret) {
        this.con = con;
    }

    get_info(project_id) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT * FROM projects WHERE id = ?', [project_id], function (error, results) {
                if(!error) {
                    return resolve(results);
                } else {
                    return resolve(false);
                }
            });
        });
    }

    update_project(project, project_creator) {
        return new Promise(async (resolve, reject) => {
            let beforeUpdate = await this.get_info(project.id);
            this.con.query('UPDATE projects SET project_name = ?, private = ? WHERE id = ?', [project.project_name, project.private, project.id], function (error, results) {
                if(!error) {

                    let oldProjectPath = path.join(__dirname, '../../', 'projects/' + project_creator + '/' + project.id + '_' + beforeUpdate[0].project_name);
                    let newProjectPath = path.join(__dirname, '../../', 'projects/' + project_creator + '/' + project.id + '_' + project.project_name);

                    if (fs.existsSync(oldProjectPath)){
                        fs.renameSync(oldProjectPath, newProjectPath);
                    }
                    
                    return resolve(results);
                } else {
                    return resolve(false);
                }
            });
        });
    }

    code_to_file(project_creator, project_id, project_name, language, code) {

        // Path: ../../project_creator/project_id + "_" + project_name
        return new Promise((resolve, reject) => {

            let project_path = path.join(__dirname, '../../', 'projects/' + project_creator + '/' + project_id + '_' + project_name);

            if (!fs.existsSync(project_path)){
                fs.mkdir(project_path, {recursive: true}, err => { console.log(err); });
            }

            fs.writeFileSync(project_path + '/' + language + '.txt', code);

            this.con.query('UPDATE projects SET last_modification = NOW() WHERE id = ?', [project_id], function (error, results) {
                if(!error) {
                    return resolve(results);
                } else {
                    return resolve(false);
                }
            });

        });
    }

    getFileContent(project_creator, project_id, project_name, language) {

        // Path: ../../project_creator/project_id + "_" + project_name
        return new Promise((resolve, reject) => {

            if (!fs.existsSync(path.join(__dirname, '../../', 'projects/' + project_creator + '/' + project_id + '_' + project_name))){

                resolve(false);

            } else {

                fs.readFile(path.join(__dirname, '../../', 'projects/' + project_creator + '/' + project_id + '_' + project_name + '/' + language + '.txt'), "utf8", function (err, data) {

                    resolve(data);

                });
            }
        });
    }
}

module.exports = Projects;