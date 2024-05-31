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

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = false;

  constructor(private roomService:RoomService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.rooms = await this.roomService.getRoomsByIdBranchFromTo(this.idBranch, 1, this.itemsPerPage + 1);

    if(this.rooms){
      if(this.rooms.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.rooms.pop();
      }
    }
  }

  //On destroy
  ngOnDestroy() {
  }

  goToNewRoomPage(): void {
    this.router.navigate(['/home/rooms/new']);
  }

  // Delete room by id
  async deleteRoom(room: Room) {

    if (window.confirm('Are you sure you want to delete the room ' + room.name + '?')) {

      this.statusCode = await this.roomService.deleteRoom(room.id);

      if (this.statusCode == 0){
        this.reloadPage()
        window.alert("Room deleted!");
      }else{
        window.alert("Error with status code: " + this.statusCode)
      }
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

  async goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.rooms = await this.roomService.getRoomsByIdBranchFromTo(this.idBranch, startIndex + 1, startIndex + this.itemsPerPage);
      this.totalPages = false
    }
  }

  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.rooms = await this.roomService.getRoomsByIdBranchFromTo(this.idBranch, startIndex + 1, startIndex + this.itemsPerPage + 1);

      if(this.rooms){
        if(this.rooms?.length <= this.itemsPerPage){
          this.totalPages = true
        }else{
          this.rooms.pop();
        }
      }
    }
  }



}
