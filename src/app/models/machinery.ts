export interface Machinery {
    id: string
    mserial: string
    name: string
    topic: string
    idRoom: string
    idBranch: string
    branchName: string
    roomName: string
    dangerousness: string //HIGH - MEDIUM - LOW - ZERO
    nearbyWorkers: number | undefined
}
