package main

import (
	"context"
	"dannyroman2015/phoebe/internal/app"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {

	// connect to postgres database
	// pgdb, err := app.OpenPgDB(`postgresql://postgres:kbEviyUjJecPLMxXRNweNyvIobFzCZAQ@monorail.proxy.rlwy.net:27572/railway`)
	// if err != nil {
	// 	log.Println("Failed to connect postgres database")
	// }
	// defer pgdb.Close()

	// connect to mongodb
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	// client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://mongo:rzLmDKylubzBEngsuxZTvuqgfFxXFxVM@roundhouse.proxy.rlwy.net:49073"))
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://mongo:jiRpwmoWwFGtCAFYBgxmYCDjEVMKoMhM@mongodb.railway.internal:27017"))

	if err != nil {
		panic(err)
	}
	// mgdb := client.Database("phoebe")

	mgdb := client.Database("maindb")

	port := os.Getenv("PORT")
	if port == "" {
		port = ":3000"
	} else {
		port = ":" + port
	}

	// server := app.NewServer(port, pgdb)
	// server := app.NewServer(port, mgdb, pgdb)
	server := app.NewServer(port, mgdb)
	server.Start()
}
