const fs = require('fs');
const { resolve } = require('path');
const path = require('path');

class Projects {

    constructor(con, secret) {
        this.con = con;
    }

    getProjects(page) {
        return new Promise((resolve, reject) => {
            var offset = (page - 1) * 16;
            var limit = page * 16;
            this.con.query('SELECT projects.*, users.username, users.avatar FROM projects INNER JOIN users ON projects.creater_id = users.id WHERE projects.private = 0 ORDER BY projects.id LIMIT ?, ?', [offset, limit], function (error, results) {
                if(!error) {
                    return resolve(results);
                } else {
                    return resolve(false);
                }
            });
        });
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

    saveThumbnail(project_info, project_data) {

        return new Promise((resolve, reject) => {

            var base64Data = project_data.split("base64,")[1];
            let filename = "" + project_info[0].id + '_' + project_info[0].project_name + ".png";
            let filtered_filename = filename.replace(/\s/g, '');
            var image_path = path.join(__dirname, '../../', 'assets/images/thumbs/' + filtered_filename);
            
            fs.writeFileSync(image_path, base64Data, 'base64');

            this.con.query('UPDATE projects SET project_thumb = ? WHERE id = ?', [filtered_filename, project_info[0].id], function (error, results) {
                if(!error) {
                    return resolve(results);
                } else {
                    return resolve(false);
                }
            });
        });
    }
}

module.exports = Projects;