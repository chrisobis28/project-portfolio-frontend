import { Project } from '../../classes';

export class Model {
   
    projectList: Project[] = []
    initialize(projects: Project[]): void {
    
    this.projectList = []
    this.projectList = projects  

    }


}