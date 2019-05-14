module.exports.assignOwnProperty=function (objectTemplate,objectInput) {
    for(let key of Object.keys(objectTemplate)){
        if(objectInput[key]){
            objectTemplate[key]=objectInput[key];
        }else{
            delete objectTemplate[key];
        }
    }
    return objectTemplate;
}