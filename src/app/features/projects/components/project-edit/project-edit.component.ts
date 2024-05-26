import { Component , OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { MediaService } from '../../services/media.service';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';
import { Media } from '../../models/project-models';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css'],
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule,
     InputTextareaModule, ChipsModule, TableModule, TagModule,
      RatingModule, ButtonModule, CommonModule],
  providers: [MediaService]
})

export class ProjectEditComponent implements OnInit {
  media: Media[] = [
    {
      mediaId: '1',
      name: 'Media 1',
      path: '/path/to/media1',
      requestMediaProjects: []
    },
    {
      mediaId: '2',
      name: 'Media 2',
      path: '/path/to/media2',
      requestMediaProjects: []
    },
    {
      mediaId: '3',
      name: 'Media 3',
      path: '/path/to/media2',
      requestMediaProjects: []
    },
    {
      mediaId: '4',
      name: 'Media 4',
      path: '/path/to/media2',
      requestMediaProjects: []
    },
    {
      mediaId: '4',
      name: 'Media 5',
      path: '/path/to/media2',
      requestMediaProjects: []
    },
  ];
  
  constructor(private mediaService: MediaService) {}

  ngOnInit() {
      this.mediaService.getMediaByProjectId(1).subscribe((response: Media[]) => {
        //this.media = Media();//response
      })
  }

  title: string | undefined;
  tags: string[] | undefined;
  colaborators: string[] | undefined;
  description: string | undefined;
}
