import { Component } from '@angular/core';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent {

  rooms: Room[] | null = [];

  idBranch: any = localStorage.getItem('idBranch')

  constructor(private roomService:RoomService, private router: Router) {
  }

  async ngOnInit() {
    this.rooms = await this.roomService.getRoomsByIdBranch(this.idBranch);
  }

  goToMachineriesPage(idRoom: any) {
    localStorage.setItem('idRoom', idRoom)
    this.router.navigate(['machinery']);
  }

  ngOnDestroy(){
    //localStorage.removeItem('idBranch')
  }

}
