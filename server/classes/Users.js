class Users{
    constructor(){
        this.people = [];
    }

    addPerson(id, name, room){
        let person = {id, name, room};
        this.people.push(person);

        return this.people;
    }

    getPerson(id){
        let person = this.people.find(p => p.id === id);

        return person;
    }

    getPeople(){
        return this.people;
    }

    getRoomPeople(room){
        const roomPeople = this.people.filter(p => p.room === room);
        return roomPeople;
    }

    removePerson(id){
        let removedPerson = this.getPerson(id);
        this.people = this.people.filter(p => p.id !== id);

        return removedPerson;
    }
}

module.exports = {
    Users
}