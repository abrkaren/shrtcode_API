import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from "../../shared/services/data.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  shortenLinkForm: FormGroup;
  ng_invalid = false;
  ng_error = null;
  ng_disabled = false;

  shortedLinks = [];

  constructor( private fb: FormBuilder,
               private dataService: DataService) { }

  ngOnInit(): void {
    console.log(JSON.parse(localStorage.getItem('shortedLinks')))
    if(localStorage.getItem('shortedLinks')) {
      this.shortedLinks = JSON.parse(localStorage.getItem('shortedLinks'));
    }
    this.formControlsShortenLinkForm();
  }

  formControlsShortenLinkForm() {
    this.shortenLinkForm = this.fb.group({
      link: [null, [Validators.required]]
    });
  }

  submitShortenLinkForm() {
    this.ng_error = null;
    if(this.shortenLinkForm.value.link) {
      this.ng_invalid = false;
      this.ng_disabled = true;
      this.dataService.createShortenLink(this.shortenLinkForm.value).subscribe(res => {
        this.ng_disabled = false;
        this.shortedLinks.push({
          original_link: res['result'].original_link,
          short_link: res['result'].full_short_link
        });
        localStorage.setItem('shortedLinks', JSON.stringify(this.shortedLinks));
      }, error => {
        console.log(error)
        this.ng_error = error.error.error
        this.ng_disabled = false;
      })
    } else {
      this.ng_invalid = true
    }
  }

  copyLink(link) {
    link.isLinkCopied = true;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = link.short_link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
