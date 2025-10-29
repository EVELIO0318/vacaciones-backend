
const db=require('../utils/db');


class Feriados{

    static async saveFeriado(descripcion,fechainicio,fechafin,aplicaAtodas){
        console.log(descripcion,fechainicio,fechafin,aplicaAtodas);
        const [result]= await db.execute('INSERT INTO feriados (descripcion,fechaInicio,fechaFin,aplicaTodas) VALUES (?,?,?,?)', [descripcion,fechainicio,fechafin,aplicaAtodas]);
        return result.insertId;
    }


    static async saveFeriadoFilial(IDferiado,IDfilial){
        const [rows]=await db.execute('INSERT INTO feriadosfilial (IDferiado,IDfilial) VALUES (?,?)',[IDferiado,IDfilial]);
        return rows;
    }

    static async getAllFeriados(){
        const [rows]=await db.execute('SELECT f.IDferiado, f.descripcion, f.fechaInicio, f.fechaFin, f.aplicaTodas, GROUP_CONCAT(ff.IDfilial) AS filiales_ids FROM feriados f LEFT JOIN FeriadosFilial ff ON f.IDferiado = ff.IDferiado GROUP BY f.IDferiado, f.descripcion, f.fechaInicio, f.fechaFin, f.aplicaTodas ORDER BY f.fechaInicio;');
        return rows;
    }


    static async UpdateFeriado(IDferiado,descripcion,fechaInicio,fechaFin,aplicaAtodas){
        const [result]=await db.execute('UPDATE feriados SET descripcion=?,fechaInicio=?,fechaFin=?,aplicaTodas=? WHERE IDferiado=?',[descripcion,fechaInicio,fechaFin,aplicaAtodas,IDferiado]);
        return {IDferiado,descripcion,fechaInicio,fechaFin,aplicaAtodas};
    }


    static async DeleteferiadoFilial(IDferiado){
        const [result]= await db.execute('DELETE FROM feriadosfilial WHERE IDFeriado=?',[IDferiado]);
        return result;
    }

    static async getFeriadosNacionales(){
        const [rows] = await db.execute(`SELECT fechaInicio, fechaFin FROM feriados WHERE aplicaTodas = 1`);
        return rows;
    }

    static async getFeriadosPorFilial(IDfilial){
        const [rows]=await db.execute('SELECT f.fechaInicio, f.fechaFin FROM feriados f INNER JOIN feriadosfilial ff ON f.IDferiado = ff.IDFeriado WHERE ff.IDfilial = ? AND f.aplicaTodas = 0',[IDfilial]);
        return rows;
    }


    static async deleteFeriadoAll(IDferiado){
        const [result]= await db.execute('DELETE FROM feriados WHERE IDferiado=?',[IDferiado]);
        return result;
    }

}


module.exports=Feriados
