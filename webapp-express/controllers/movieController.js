//task import oggetto connection dal database
import connection from '../data/movies_db.js';

//task setup callback functions da esportare

//todo index
function index(req, res) {
    const sql = `SELECT * FROM movies`;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({
            error: "Server Side Error INDEX function"
        });
        // res.json(results); //* AGGIORNAMENTO CON USO MIDDLEWARE
        const movies = results.map(m => {
            return {
                ...m,
                image: req.imagePath + m.image,
            };
        });
        res.json(movies)//* RISULTATO CON USO MIDDLEWARE
    })
}

//todo show
function show(req, res) {
    const { id } = req.params

    const movieSql = `SELECT * FROM movies WHERE id = ?`;

    const reviewsSql = 'SELECT * FROM reviews WHERE movie_id = ?';

    connection.query(movieSql, [id], (err, movieResults) => {
        if (err) return res.status(500).json({
            error: "Server Side Error SHOW function"
        });

        //task controllo se movieResults ===0
        movieResults === 0 && res.status(404).json({ error: 'Film Non Trovato' });

        const movie = movieResults[0]

        connection.query(reviewsSql, [id], (err, revResults) => {
            if (err)
                return res.status(500).json({
                    error: "Server Side Error SHOW function"
                });

            movie.reviews = revResults;

            // res.json(movie)//* AGGIORNAMENTO CON USO MIDDLEWARE
            res.json({
                ...movie,
                image: req.imagePath + movie.image, //* RISULTATO CON USO MIDDLEWARE
            });
        })
    })

}

//todo patch (piccolissimo bonus) 
function update(req, res) {
    const { id } = req.params
    const { image } = req.body

    const sql = `
            UPDATE movies
            SET image = ?
            WHERE id = ?;
    `
    connection.query(sql, [image, id], (err) => {
        if (err) return res.status(500).json({
            error: "Server Side Error UPDATE function"
        });

        res.json({ message: "Movie updated successfully" });
    })
}


function destroy(req, res) {
    const { id } = req.params;
    const sql = `DELETE * FROM movies WHERE id = ? `;

    connection.query(sql, [id], (err) => {
        if (err) return res.status(500).json({
            error: "Server Side Error DELETE function"
        });

        res.sendStatu(204)
    });

}

//todo storeRev
function storeRev(req, res) {
    const { id } = req.params;
    const { text, name, vote } = req.body;

    const sqlStore = `
    INSERT INTO reviews
    (text, name, vote, book_id ) 
    VALUES (?,?,?,?)
    `;

    connection.query(sqlStore, [text, name, vote, id], (err, storeResults) => {
        if (err)
            return res.status(500).json({
                error: 'Database Errore StoreReview',
            });

        res.status(201).json({
            message: 'rev successfully added',
            id: storeResults.insertId
        });
    })

}

//todo store
function store(req, res) {
    //? l'id qui non VA aggiunto perchè accede all'autoincrement

}

export {
    index,
    show,
    destroy,
    update,
    storeRev
};

