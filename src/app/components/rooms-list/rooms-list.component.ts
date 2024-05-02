import { Component } from '@angular/core';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss'
})
export class RoomsListComponent {

  branchName: string | null = localStorage.getItem('branchName')
  idBranch: any = localStorage.getItem('idBranch')

  rooms: Room[] | null = [];

  statusCode: number = 0;

  constructor(private roomService:RoomService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.rooms = await this.roomService.getRoomsByIdBranch(this.idBranch);
  }

  //On destroy
  ngOnDestroy() {
  }

  goToNewRoomPage(): void {
    this.router.navigate(['/home/rooms/new']);
  }

  // Delete room by id
  async deleteRoom(id: any) {

    this.statusCode = await this.roomService.deleteRoom(id);

    if (this.statusCode == 0){
      this.reloadPage()
      window.alert("Room deleted!");
    }else{
      window.alert("Error with status code: " + this.statusCode)
    }
  }
  

  // Edit room by id
  async editRoom(id: any) {
    localStorage.setItem('idRoom', id)
    this.router.navigate(['/home/rooms/edit'])
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }



}