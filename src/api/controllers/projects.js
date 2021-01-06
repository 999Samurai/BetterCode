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

    update_project(project_id) {
        
    }

    code_to_file(project_creator, project_id, project_name, language, code) {

        // Path: ../../project_creator/project_id + "_" + project_name
        return new Promise((resolve, reject) => {

            if (!fs.existsSync(path.join(__dirname, '../../', 'projects/' + project_creator + '/' + project_id + '_' + project_name))){
                fs.mkdir(path.join(__dirname, '../../', 'projects/' + project_creator + '/' + project_id + '_' + project_name), {recursive: true}, err => { console.log(err); });
            }

            fs.writeFileSync(path.join(__dirname, '../../', 'projects/' + project_creator + '/' + project_id + '_' + project_name + '/' + language + '.txt'), code);

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