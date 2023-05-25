import { ClassicEditor } from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import React from 'react'

const MyCkeditor = () => {

    const API_URL = "http://localhost:8080";

    const UPLOAD_ENDPOINT = "upload-image";

    function uploadAdapter(loader){
        return{
            
            upload: () => {
                
                return new Promise((resolve, reject) => {
                    
                    const body = new FormData();
                    
                    loader.file.then((file) => {

                        body.append("uploadImg", file);

                        fetch(`${API_URL/UPLOAD_ENDPOINT}`, {
                            
                            method : "post",
                            body : body
                        }).then((res) => {

                            resolve({ default : `${API_URL}/UPLOAD_ENDPOINT/${res.url}` })
                        })
                    })
                })
            }
        }
    }

    function uploadPlugin(editor) {
        
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {

            return uploadAdapter(loader);
        }
            
    }

    return (
        <div>
            <div className='App'>
                <p>Hello VN</p>
                <CKEditor
                    config={{
                        extraPlugins : [uploadPlugin]
                    }}
                    editor={ClassicEditor}
                    data="<p>Hello VN</p>"
                    onReady={editor => {
                        console.log("editor ready to use", editor);
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        console.log({ event, editor, data });
                    }}
                    onBlur={(event, editor) => {
                        //alert("Bạn có muốn lưu file không?");
                    }}
                    onFocus={(event, editor) => {
                        console.log('Focus.', editor);
                    }}
                   />
            </div>
        </div>
    )
}

export default MyCkeditor