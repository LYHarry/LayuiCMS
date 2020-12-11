import config from '@/config'

//自定义插件列表
import 'tinymce/plugins/code' //源代码
import "tinymce/plugins/wordcount"
import "tinymce/plugins/lists"
import "tinymce/plugins/advlist" //高级列表
import "tinymce/plugins/image"
import "tinymce/plugins/imagetools"
import "tinymce/plugins/link"
import "tinymce/plugins/media"
import "tinymce/plugins/table"
import "tinymce/plugins/anchor"
import "tinymce/plugins/autolink"
import 'tinymce/plugins/autoresize'
import "tinymce/plugins/charmap" //特殊字符
import "tinymce/plugins/fullscreen"
import "tinymce/plugins/hr"
import "tinymce/plugins/insertdatetime"
import 'tinymce/plugins/pagebreak' //分页符
import "tinymce/plugins/preview"
import "tinymce/plugins/searchreplace" //查找替换
import "tinymce/plugins/paste"

// import 'tinymce/plugins/directionality' //文字方向
// import 'tinymce/plugins/codesample' //适合程序员编写技术类文章时，展示高亮源码
// import 'tinymce/plugins/autosave'
// import 'tinymce/plugins/nonbreaking' //插入不间断空格
// import "tinymce/plugins/quickbars"  //快速工具栏
// import 'tinymce/plugins/template' //内容模板
// import "tinymce/plugins/emoticons" //表情

//扩展插件
// import "tinymce/plugins/indent2em" //首行缩进
// import "tinymce/plugins/axupimgs" //多图片批量上传
// import "tinymce/plugins/bdmap" //百度地图
// import "tinymce/plugins/formatpainter" //格式刷


//解决 icons.js 报 Unexpected token '<' 错误
import "tinymce/icons/default/icons"


//插件
const plugins = [
    "code",
    "preview",
    "lists advlist",
    "image imagetools link autolink media table anchor",
    "autoresize emoticons paste",
    "charmap fullscreen hr pagebreak",
    "searchreplace wordcount insertdatetime",
    // "bdmap indent2em axupimgs formatpainter"
];

//工具栏
const toolbar = [
    'code undo redo | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
    formatselect fontselect fontsizeselect lineheight | bullist numlist | blockquote subscript superscript removeformat | \
    table image media charmap emoticons hr | pagebreak insertdatetime searchreplace | preview fullscreen |'
    // bdmap indent2em formatpainter axupimgs
];

//事件
const handlers = {
    //图片上传回调
    images_upload_handler: (blobInfo, success, failure, progress) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', `${envConfig.BASE_URL}${config.fileUploadUrl}`);
        xhr.upload.onprogress = function (e) {
            progress(e.loaded / e.total * 100);
        };
        xhr.onload = function (e) {
            if (xhr.status == 403) {
                return failure(`HTTP Error: ${xhr.status}`, {
                    remove: true
                });
            }
            if (xhr.status !== 200) {
                return failure(`HTTP Error: ${xhr.status}`);
            }
            let rest = null;
            try {
                rest = JSON.parse(xhr.responseText);
            } catch (error) {
                return failure(`Invalid JSON: ${xhr.responseText},err:${error}`);
            }
            if (rest && rest.serveStatus === 200 && rest.status === 1) {
                return success(`${envConfig.BASE_URL}${rest.data}`);
            }
            let msg = (rest && rest.message) || `Invalid JSON: ${xhr.responseText}`;
            return failure(msg);
        };
        xhr.onerror = function () {
            failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
        };
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        // 如果需要token且存在token
        // if (uploadConfig.token) {
        //     formData.append('token', uploadConfig.token)
        // }
        xhr.send(formData);
    },
    // //文件上传回调
    // file_picker_callback: function (callback, value, meta) {
    //     // Provide file and text for the link dialog
    //     if (meta.filetype == 'file') {
    //         callback('mypage.html', {
    //             text: 'My text'
    //         });
    //     }
    //     // Provide image and alt text for the image dialog
    //     if (meta.filetype == 'image') {
    //         callback('myimage.jpg', {
    //             alt: 'My alt text'
    //         });
    //     }
    //     // Provide alternative source and posted for the media dialog
    //     if (meta.filetype == 'media') {
    //         callback('movie.mp4', {
    //             source2: 'alt.ogg',
    //             poster: 'image.jpg'
    //         });
    //     }
    // },

    //粘贴的内容插入编辑器之前
    paste_preprocess: (plugin, args) => {},
    //粘贴的内容插入到编辑器之前但在将其解析为DOM结构之后
    paste_postprocess: (plugin, args) => {
        // const imgNodeList = args.node.getElementsByTagName('img');
        // if (!(imgNodeList && imgNodeList.length > 0)) {
        //     return false;
        // }
        // for (let index = 0; index < imgNodeList.length; index++) {
        //     const element = imgNodeList[index];
        //     if (!element.src) continue;
        //     var xhr = new XMLHttpRequest();
        //     xhr.responseType = 'blob';
        //     xhr.open('GET', element.src, true);
        //     xhr.onreadystatechange = function () {
        //         if (this.readyState == 4 && this.status == 200) {
        //             console.log('this.response ', this.response)
        //             // upload(this.response);
        //         }
        //     };
        //     xhr.send();
        // }
    }
};

export default {
    language_url: "/tinymce/langs/zh_CN.js",
    language: "zh_CN",
    //皮肤
    skin_url: "/tinymce/skins/ui/oxide",

    height: 500,
    min_height: 300,
    placeholder: '请输入正文',

    plugin_preview_width: '175px', // 预览宽度
    // plugin_preview_height: 668,

    plugins: plugins,
    toolbar: toolbar,

    fontsize_formats: '8px 12px 14px 16px 18px 24px 36px 48px 56px 72px',
    font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',

    branding: false, //去水印,是否启用“Powered by TinyMCE”
    menubar: false, //顶部菜单栏显示
    elementpath: false, //隐藏底栏的元素路径

    // end_container_on_empty_block: true, // enter键 分块
    // powerpaste_word_import: 'merge', // 是否保留word粘贴样式  clean | merge
    // paste_data_images: true, // 允许粘贴图像
    // paste_block_drop: true, //将禁用拖入内容到编辑器
    // content_style: ` * { padding:0; margin:0; }   img {max-width:100% !important }`,


    //事件
    ...handlers

}