use actix_web::{web, App, HttpServer};
use actix_files::{NamedFile, Files};
use std::path::PathBuf;
use actix_web::Error;

async fn index() -> Result<NamedFile, Error> {
    let path: PathBuf = PathBuf::from("./public/index.html");
    //Ok::<NamedFile, E>(NamedFile::open(path)?)
    Ok(NamedFile::open(path)?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(index))
            .service(Files::new("/", "./build"))
            .service(Files::new("/", "./public"))
    })
    .bind("localhost:3000")?
    .run()
    .await
}