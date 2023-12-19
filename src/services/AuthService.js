import axios from "../utils/axios";
export class AuthService{
    constructor(){

    }
    async signUp({email , password , name}){
        try {
            const data = {
                email,
                password , 
                name
            }
            const result = await axios.post("signup" , data )
            
            console.log(result.data);
            return result.data;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async getCurrentUser(){
        try {
            const result = await axios.get("getCurrentUser" , {
                withCredentials : true
            })
            console.log(result.data);
            if(result){
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}
const authService = new AuthService();
export default authService;