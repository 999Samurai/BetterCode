<template>

    <div v-if="dataReady">

        <header>
        
            <h1 style="float: left;">
                <div class="changelog-badge">
                    <b-navbar-brand href="/">BetterCode</b-navbar-brand>
                    
                    <b-modal
                    id="modal-prevent-closing"
                    ref="modal" 
                    title="Update Project"
                    @ok="handleUpdate"
                    >
                        <form ref="form" @submit.stop.prevent="handleSubmit">
                            <b-form-group
                                label="Project Name"
                                label-for="project_name"
                                invalid-feedback="Project Name is required"
                            >
                                <b-form-input
                                    id="project_name"
                                    v-model="project_info.project_name"
                                    v-validate="'required|min:3|max:20'"
                                    required
                                ></b-form-input>
                            </b-form-group>
                            <b-form-radio-group
                                id="radio-group-2"
                                v-model="project_info.private"
                                name="radio-sub-component"
                            >
                                <b-form-radio value="0">Public</b-form-radio>
                                <b-form-radio value="1">Private</b-form-radio>
                            </b-form-radio-group>
                        </form>
                    </b-modal>
                </div>
            </h1>

            <div style="float: right;">

                <h2 v-b-modal.modal-prevent-closing><b-icon icon="gear"></b-icon> Project Settings</h2>

            </div>

        </header>

        <multipane class="vertical-panes" layout="vertical" v-if="!this.fullscreen">
            <div class="pane" :style="{ minWidth: '25vw', width: '50vw', maxWidth: '75vw', background: '#1f2227', color: '#fff' }">
                <div>
                    <h6 class="title is-6">HTML</h6>
                    <codemirror
                        ref="cmEditor"
                        :value="this.code.html"
                        :options="cmOptionsHtml"
                        @input="onCmCodeChangeHtml"
                    />                
                    </div>
            </div>
            <multipane-resizer></multipane-resizer>
            <div class="pane" :style="{ flexGrow: 1, background: '#1f2227', color: '#fff' }">
                <div>
                    <h6 class="title is-6">CSS</h6>
                    <codemirror
                        ref="cmEditor"
                        :value="this.code.css"
                        :options="cmOptionsCss"
                        @input="onCmCodeChangeCss"
                    />                       
                </div>
            </div>
        </multipane>

        <multipane class="vertical-panes" layout="vertical" style="margin-top: -1px;">
            <div  v-if="!this.fullscreen" class="pane" :style="{ minWidth: '25vw', width: '50vw', maxWidth: '75vw', background: '#1f2227', color: '#fff' }">
                <div>
                    <h6 class="title is-6">Javascript</h6>
                    <codemirror
                        ref="cmEditor"
                        :value="this.code.javascript"
                        :options="cmOptionsJs"
                        @input="onCmCodeChangeJs"
                    />        
                </div>
            </div>
            <multipane-resizer></multipane-resizer>
            <div class="pane" v-if="this.fullscreen" :style="{ flexGrow: 1, background: '#1f2227', color: '#fff', height: '92vh' }">
                <div>
                    <h6 class="title is-6" style="float: left;">Result</h6>
                    <a style="cursor: pointer;"><b-icon v-on:click="minimizeScreen()" icon="fullscreen-exit" aria-hidden="true" style="float: right;"></b-icon></a>
                    <div ref="compile" style="top: 0; bottom: 0; left: 0; right: 0;">
                        <iframe :srcdoc="'<html>' + this.code.html + '</html><style>' + this.code.css + '</style><script>' + this.code.javascript + '</script>'" style="clear:both; width: 100%; height: 85vh; background-color: white;"></iframe>
                    </div>
                </div>
            </div>
            <div class="pane" v-if="!this.fullscreen" :style="{ flexGrow: 1, background: '#1f2227', color: '#fff' }">
                <div>
                    <h6 class="title is-6" style="float: left;">Result</h6>
                    <a style="cursor: pointer;"><b-icon v-on:click="setFullscreen()" icon="fullscreen" aria-hidden="true" style="float: right;"></b-icon></a>
                    <div ref="compile" style="top: 0; bottom: 0; left: 0; right: 0;">
                        <iframe :srcdoc="'<html>' + this.code.html + '</html><style>' + this.code.css + '</style><script>' + this.code.javascript + '</script>'" style="clear: both; width: 100%; height: 300px; background-color: white;"></iframe>
                    </div>
                </div>
            </div>
        </multipane>

    </div>

</template>

<script>

    import { Multipane, MultipaneResizer } from 'vue-multipane';
    import { codemirror } from 'vue-codemirror'

    import UserService from '../services/user.service';

    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/3024-night.css'
    import 'codemirror/mode/htmlmixed/htmlmixed.js'
    import 'codemirror/mode/css/css.js'
    import 'codemirror/mode/javascript/javascript.js'
    
    export default {

        data() {
            return {
                successful: '',
                project_info: {},
                fullscreen: false,
                dataReady: false,
                code: {
                    html: '',
                    css: '',
                    javascript: ''
                },
                cmOptionsHtml: {
                    tabSize: 4,
                    autofocus: true,
                    styleActiveLine: true,
                    matchBrackets: true,
                    lineWrapping: true,
                    mode: 'text/html',
                    theme: '3024-night',
                    lineNumbers: true,
                    line: true
                },
                cmOptionsCss: {
                    tabSize: 4,
                    autofocus: true,
                    styleActiveLine: true,
                    matchBrackets: true,
                    lineWrapping: true,
                    mode: 'text/css',
                    theme: '3024-night',
                    lineNumbers: true,
                    line: true
                },
                cmOptionsJs: {
                    tabSize: 4,
                    autofocus: true,
                    styleActiveLine: true,
                    matchBrackets: true,
                    lineWrapping: true,
                    mode: 'text/javascript',
                    theme: '3024-night',
                    lineNumbers: true,
                    line: true
                }
            }
        },
        components: {
            Multipane,
            MultipaneResizer,
            codemirror
        },
        async beforeMount() {
            await UserService.getProjectInfo(this.$route.params.id).then(response => {

                if(response.data.success == true) {

                    this.project_info = response.data.project[0];

                    this.successful = true;
                    this.dataReady = true;

                }  else if (response.data.auth == false){ // Expired or invalid token

                    this.$router.push('/logout');

                } else {

                    this.successful = false;
                    this.dataReady = true;

                }
            })

            await UserService.getFileContent(this.project_info.id, 'html').then(response => {
                if(response.data.success == true) {
                    this.code.html = response.data.code;
                } else {
                    this.code.html = "<p>Hello World</p>";
                }
            })

            await UserService.getFileContent(this.project_info.id, 'css').then(response => {
                if(response.data.success == true) {
                    this.code.css = response.data.code;
                } else {
                    this.code.css = "p {\n\tcolor: red;\n}";
                }
            })

            await UserService.getFileContent(this.project_info.id, 'js').then(response => {
                if(response.data.success == true) {
                    this.code.javascript = response.data.code;
                } else {
                    this.code.javascript = "var a = 10;";
                }
            })

            setInterval(async () => { await this.downloadVisualReport(); }, 15000);
        },     
        computed: {
            currentUser() {
                return this.$store.state.auth.user;
            }
        },
        methods: {  

            async downloadVisualReport () {

                const el = this.$refs.compile;

                const options = {
                    type: 'dataURL',
                    debug: false,
                    scale: 5
                }

                let data = await this.$html2canvas(el, options);

                UserService.updateThumbnail(this.project_info.id, data);

            },

            handleUpdate() {

                UserService.updateProject(this.project_info).then(response => {

                    if(response.data.success == false) {

                        this.project_info = response.data.project;

                    }

                });

            },

            async onCmCodeChangeHtml(cm) {

                this.code.html = cm;
                UserService.writeToFile(this.project_info.id, 'html', cm);

            },
            onCmCodeChangeCss(cm) {

                this.code.css = cm;
                UserService.writeToFile(this.project_info.id, 'css', cm);

            },
            onCmCodeChangeJs(cm) {

                this.code.javascript = cm;
                UserService.writeToFile(this.project_info.id, 'js', cm);
            },
            setFullscreen() {
                this.fullscreen = true;
            }, 
            minimizeScreen() {
                this.fullscreen = false;
            }
        }
    }

</script>

<style scoped>

header {
    margin: 0 -21.45%;
    height: 60px;
    background: #1a1d21;
    box-shadow: 0 0 5px rgba(26,29,33,0);
    z-index: 100;
    width: 100vw;
}

header h1 {
    position: absolute;
    top: -5px;
    left: 10px;
    z-index: 800;
    transition: all .15s;
}

header div h2 {
    position: absolute;
    font-size: 16px;
    top: 17px;
    z-index: 800;
    transition: all .15s;
    right: 10px;
    color: #fff;
    text-decoration: none;
    outline: none;
    cursor: pointer;
}

.changelog-badge .navbar-brand {

    text-decoration: none;
    color: #fff;
    outline: none;
    box-shadow: none !important;

}

.vertical-panes {
  width: 100vw;
  height: 347.5px;
  border: 1px solid #2C2F34;
  margin-left: -21.5%
}

.vertical-panes > .pane {
  text-align: left;
  padding: 15px;
  overflow: hidden;
  background: #eee;
}

.vertical-panes > .pane ~ .pane {
  border-left: 1px solid #2C2F34;
}

</style>
