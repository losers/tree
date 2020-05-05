let data = {};
data.isProd = true;

data.getHostURL = function(){
    if(this.isProd){
        return "https://blineapi.herokuapp.com";
    }
    else{
        return "http://localhost:5000";
    }
}

export default data;