import axios from 'axios';
import authHeader from './auth-header';

const FILE_API_BASE_URL = "http://localhost:8080/file/";
class FileService{
    uploadFile(file,onUploadProgress){
        const formData=new FormData();
        const user = JSON.parse(localStorage.getItem('user'));
        formData.append("file",file);
        if (user && user.accessToken) {
            return axios.post( FILE_API_BASE_URL+"upload", formData, {  headers:{ "Content-Type": "multipart/form-data", Authorization: 'Bearer ' + user.accessToken },onUploadProgress})
          } else {
            return {};
          }
       
    }
    downloadFile(fileId){
      return axios.get( FILE_API_BASE_URL+"download/"+fileId,{  responseType: 'arraybuffer', headers: authHeader() })
    }
}
export default new FileService();