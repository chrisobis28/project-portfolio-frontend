import { Component } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent {

  projectForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private projectService: ProjectService) {
    this.projectForm = this.formBuilder.group({
        title: ['', Validators.required, Validators.max(50)],
        description: ['', [Validators.required, Validators.email]],
        bibtex: ['', Validators.required],
        archived: false,
        template: null
      });
  }

  onSubmit() {
    if(this.projectForm.valid) {
      this.projectService.createProject(this.projectForm.value).subscribe(response => {
        console.log('Project added successfully', response);
      }, error => {
        console.error('An error occurred when adding a project', error);
      })
    }
  }
}
