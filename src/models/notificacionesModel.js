const db=require('../utils/db');


class Notificaciones{
    static async crear(usuario_id,mensaje){
        const [result]=await db.execute('INSERT INTO Notificaciones (usuario_id,mensaje)VALUES(?,?)',[usuario_id,mensaje]);
        return result.insertId;
    }

    static async getNotificaciones(){
        const [rows]=await db.execute('SELECT * from Notificaciones WHERE leido=0');
        return rows;
    }

    static async MarcarLeidas(){
        const [result]=await db.execute("UPDATE notificaciones SET leido=1");
        return result;
    }
}

module.exports=Notificaciones;