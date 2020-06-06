export class OperationsDetails {
    userName: String;
    location: string;
    projectName: string;
    position: string;
    comments: string;
    createdBy: String;
    createdDate: Date;
 
    constructor(userName, location, projectName, position, comments, createdBy, createdDate) {
            this.userName = userName;
            this.location = location;
            this.projectName = projectName;
            this.position  = position;
            this.comments = comments;
            this.createdBy = createdBy;
            this.createdDate = createdDate;
    }
 
 }
 