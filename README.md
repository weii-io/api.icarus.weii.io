# Icarus-API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Icarus-API is a RESTful API designed to serve as the backend for the [Icarus](https://github.com/weii-io/icarus) project. The API provides a secure and efficient way to interact with the Icarus system, allowing users to manage their data and perform various tasks.

Icarus is a powerful and flexible project management tool that helps teams collaborate and organize their work. With its intuitive user interface, users can easily create, manage, and track tasks, deadlines, and milestones.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- User authentication and authorization
- Project management: Create, edit, and delete projects
- Task management: Add, update, and remove tasks within projects
- Team collaboration: Invite and manage team members
- Deadline and milestone tracking
- Activity tracking and notifications

## Getting Started

### Prerequisites
To use the Icarus-API, you will need the following installed on your system:
- Node.js (>= v14.0.0)
- npm (>= v6.14.0)
- Docker

### Installation

1. Clone the repository
`git clone https://github.com/weii-io/icarus-api.git`

2. Navigate to the project directory
`cd icarus-api`

3. Install required dependencies
`npm install`

### Configuration

1. Create a `.env` file in the root directory of the project
`touch .env`


2. Open the `.env` file and add the following environment variables with appropriate values:
- PORT=3333
- DATEBASE_URL=<your_database_url>
- ACCESS_TOKEN_SECRET=<your_access_token_secret_key>
- ACCESS_TOKEN_TTL=<your_access_token_ttl>
- REFRESH_TOKEN_SECRET=<your_refresh_token_secret_key>
- REFRESH_TOKEN_TTL=<your_refresh_token_ttl>
- NODE_ENV="dev"

### Testing

1. Create a `.env.test` file in the root directory of the project
`touch .env`

2. Open `docker-compose.yaml` and modify the database name, username, password and port

2. Open the `.env.test` file and add the following environment variables with appropriate values:
- PORT=3333
- DATEBASE_URL=postgresql://<database_username>:<database_password>@localhost:<database_port>/<database_name>?schema=public
- ACCESS_TOKEN_SECRET=<your_access_token_secret_key>
- ACCESS_TOKEN_TTL=<your_access_token_ttl>
- REFRESH_TOKEN_SECRET=<your_refresh_token_secret_key>
- REFRESH_TOKEN_TTL=<your_refresh_token_ttl>
- NODE_ENV="test"

3. `npm run test:e2e`

## Usage

To start the development server, run:
npm run start:dev

## API Documentation

The API documentation is available in the `docs` folder. You can also access it via the following link: [API Documentation](https://weii-io.github.io/icarus-api)

## Contributing

Contributions are always welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before making any contributions or submitting issues.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

If you have any questions or suggestions, feel free to open an issue or submit a pull request. You can also reach out to the maintainers by visiting the [Icarus project page](https://github.com/weii-io/icarus).
