import uuid
from datetime import datetime
from azure.cosmos.aio import CosmosClient
from azure.cosmos import exceptions

class CosmosHRmanagersDBClient():
    def __init__(self, cosmosdb_endpoint: str, credential: any, database_name: str, container_name: str):
        self.cosmosdb_endpoint = cosmosdb_endpoint
        self.credential = credential
        self.database_name = database_name
        self.container_name = container_name
        try:
            self.cosmosdb_client = CosmosClient(self.cosmosdb_endpoint, credential=credential)
        except exceptions.CosmosHttpResponseError as e:
            if e.status_code == 401:
                raise ValueError("Invalid credentials") from e
            else:
                raise ValueError("Invalid CosmosDB endpoint") from e
        try:
            self.database_client = self.cosmosdb_client.get_database_client(database_name)
        except exceptions.CosmosResourceNotFoundError:
            raise ValueError("Invalid CosmosDB database name") 
        
        try:
            self.container_client = self.database_client.get_container_client(container_name)
        except exceptions.CosmosResourceNotFoundError:
            raise ValueError("Invalid CosmosDB container name") 

    async def ensure(self):
        if not self.cosmosdb_client or not self.database_client or not self.container_client:
            return False, "CosmosDB client not initialized correctly"
        try:
            database_info = await self.database_client.read()
        except:
            return False, f"CosmosDB database {self.database_name} on account {self.cosmosdb_endpoint} not found"
        
        try:
            container_info = await self.container_client.read()
        except:
            return False, f"CosmosDB container {self.container_name} not found"
            
        return True, "CosmosDB client initialized successfully"
     
    async def get_database_client(self, database_name: str):
        try:
            database_client = self.cosmos_client.get_database_client(database_name)
            await database_client.read()
            return database_client
        except exceptions.CosmosResourceNotFoundError:
            raise ValueError("Invalid CosmosDB database name")
        
    async def get_container_client(self, container_name: str):
        try:
            container_client = self.database_client.get_container_client(container_name)
            await container_client.read()
            return container_client
        except exceptions.CosmosResourceNotFoundError:
            raise ValueError("Invalid CosmosDB container name")
        
    async def get_personal_info(self, user_id: str):
        try:
            query = f"SELECT * FROM c WHERE c.id = '{user_id}'"
            user_info = [item async for item in self.container_client.query_items(query, enable_cross_partition_query=True)]
            if not user_info:
                return None
            return user_info[0]
        except exceptions.CosmosHttpResponseError as e:
            raise ValueError(f"Error querying CosmosDB: {str(e)}")
        
    async def close(self):
        await self.cosmosdb_client.close()