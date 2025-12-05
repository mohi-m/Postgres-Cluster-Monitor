from locust import HttpUser, task, between


class ApiUser(HttpUser):
    wait_time = between(0.1, 0.5)

    @task(10)
    def get_data(self):
        self.client.get("/data")
