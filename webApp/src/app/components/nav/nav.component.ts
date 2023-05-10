import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: "app-nav",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule],
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent {
  // @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  // openMenu() {
  //   this.trigger.openMenu();
  // }
}
