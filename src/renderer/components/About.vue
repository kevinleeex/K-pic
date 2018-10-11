<template>
    <div>
        <el-container>
            <el-header height="100px">
                <div class="app_title" @click="open('http:lidengju.com')">K-Pic</div>
                <div class="version"><p><span>{{$t('m.version')}}:</span> <span>{{$t('m.vno')}}</span></p></div>
                <div class="intro"><p>{{$t('m.intro')}}</p></div>
                <div class="animated rubberBand delay-1s"
                     style="display: inline-block;width: 50%;margin-top: 10px;font-size: 12px">
                    <img width="14px" src="../assets/icons/code-solid.svg">
                    <span>with</span>
                    <img width="12px" src="../assets/icons/heart-solid.svg">
                </div>
            </el-header>
            <el-main>
                <div style="width: 40%; display: inline-block">
                    <el-row :gutter="30">
                        <el-col>
                            <div class="list-block">
                                <div></div>
                                <ul>
                                    <li @click="open(githubUrl)" class="stack_item"><img width="50px"
                                                                                         src="../assets/icons/GitHub.svg">
                                    </li>
                                    <li @click="open(readme)" class="stack_item"><b>README</b></li>
                                    <li @click="donateDialogShow = true" @mouseover="repeatStatus=true"
                                        @mouseleave="repeatStatus=false"
                                        :class="[{'repeat_anim': repeatStatus},'stack_item', 'animated', 'swing', 'delay-1s']"
                                        style="color: #ec571d;"><b>{{$t('m.donate')}}</b></li>
                                    <li @click="licenseDialog = true" class="stack_item">{{$t('m.license')}}</li>
                                    <li @click="checkUpdate" class="stack_item">{{$t('m.checkUpdate')}}</li>
                                </ul>
                                <div class="foot_bar">
                                    <span>©2018</span><span> | </span><span class="kevin clickable"
                                                                            @click="open('http://lidengju.com')">{{$t('m.author')}}</span>
                                    <span></span><br><span>designed & developed.</span>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-main>
        </el-container>
        <el-dialog width="60%" :title="$t('m.donate')" :visible.sync="donateDialogShow">
            <div style="margin-bottom: 5px">{{$t('m.tips.thanks')}}</div>
            <el-row :gutter="20">
                <el-col :span="12"><img width="220px" src="@/assets/imgs/wechatpay.png"></el-col>
                <el-col :span="12"><img width="220px" src="@/assets/imgs/alipay.png"></el-col>
            </el-row>
        </el-dialog>

        <el-dialog width="60%" :title="$t('m.license')" :visible.sync="licenseDialog">
            <p>The MIT License (MIT)<br>

                Copyright (c) 2018-present, Dengju Li (Kevin T. Lee)<br>

                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:<br>

                The above copyright notice and this permission notice shall be included in
                all copies or substantial portions of the Software.<br>

                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                THE SOFTWARE.</p>
        </el-dialog>
    </div>
</template>

<script>
  /* eslint-disable no-unused-vars */

  import {sender, reciever} from '../utils/pipeline'

  export default {
    name: 'About',
    data () {
      return {
        githubUrl: 'https://github.com/kevinleeex/K-pic',
        readme: 'https://github.com/kevinleeex/K-pic/docs',
        repeatStatus: false,
        donateDialogShow: false,
        licenseDialog: false
      }
    },
    methods: {

      open (url) {
        this.$electron.shell.openExternal(url)
      },
      checkUpdate () {
        sender.checkUpdate()
      }
    }
  }
</script>

<style scoped>
    .list-block {
        justify-content: center;
        padding: 10px;
        background-color: #f8f8f8;
        font-size: 12px;
        height: 200px;
        box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.50);
    }

    ul {
        display: inline-block;
        width: 70%;
        font-size: 16px;
        font-family: 'Lato', 'Helvetica Neue', Arial, sans-serif;
    }

    li.stack_item {
        margin-top: 5px;
        line-height: 25px;
        height: 25px;
        color: black;
        align-content: center;
    }

    .repeat_anim {
        animation-iteration-count: infinite;
    }

    .foot_bar {
        font-size: 10px;
        color: #888888;
        position: absolute;
        width: 200px;
        bottom: 2%;
        left: calc(50% - 100px)
    }

    .kevin:hover {
        transition-duration: 0.5s;
        color: #95dafc;
    }


</style>
