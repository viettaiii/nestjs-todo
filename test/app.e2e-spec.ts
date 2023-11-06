import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
const PORT = 8004;
describe('Test App (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    prismaService = app.get(PrismaService);
    await app.init();
    await app.listen(PORT);
    await prismaService.cleanDatabase();
    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  afterAll(async () => {
    app.close();
  });

  it.todo('should pass');

  describe('Test authentication', () => {
    describe('Register', () => {
      it('Should register a user successfully', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'email@gmail.com',
            password: '123123',
            fullName: 'viettai',
          })
          .expectStatus(201)
          .inspect();
      });

      it('Should throw email is not valid', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'email',
            password: '123123',
            fullName: 'viettai',
          })
          .expectStatus(400)
          .inspect();
      });

      it('Should throw password is not empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'email@gmail.com',
            fullName: 'viettai',
          })
          .expectStatus(400)
          .inspect();
      });

      it('Should throw fullName is not empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'email@gmail.com',
            password: '123123',
          })
          .expectStatus(400)
          .inspect();
      });
    });
    describe('Login', () => {
      it('Should login successfully', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: 'email@gmail.com',
            password: '123123',
          })
          .expectStatus(200)
          .stores('accessToken', 'accessToken')
          .inspect();
      });

      it('Should email is incorrect', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: 'email123@gmail.com',
            password: '123123',
          })
          .expectStatus(403)
          .inspect();
      });

      it('Should password is incorrect', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: 'email@gmail.com',
            password: '123123123',
          })
          .expectStatus(403)
          .inspect();
      });
    });
    describe('Logout', () => {
      it('Should logout successfully', () => {
        return pactum
          .spec()
          .post('/auth/logout')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });
      it('Should logout failed', () => {
        return pactum.spec().post('/auth/logout').expectStatus(401).inspect();
      });
    });
  });

  describe('Test Todo', () => {
    describe('Insert todo', () => {
      it('Should one insert successfully', () => {
        return pactum
          .spec()
          .post('/todos')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({
            title: 'todo 1',
            completed: true,
          })
          .expectStatus(201)
          .inspect()
          .stores('todoId2', 'id');
      });

      it('Should two insert successfully', () => {
        return pactum
          .spec()
          .post('/todos')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({
            id: 1,
            title: 'todo 2',
            completed: false,
          })
          .expectStatus(201)
          .inspect();
      });

      it('Should insert throw title can not empty', () => {
        return pactum
          .spec()
          .post('/todos')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({
            completed: false,
          })
          .expectStatus(400)
          .inspect();
      });
    });

    describe('Get all todos me', () => {
      it('Should all todos me successfully', () => {
        return pactum
          .spec()
          .get('/todos/me')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200)
          .inspect();
      });

      it('Should all todos me failed', () => {
        return pactum.spec().get('/todos/me').expectStatus(401).inspect();
      });
    });

    describe('Get detail todo', () => {
      it('Should get one todo successfully', () => {
        return pactum
          .spec()
          .get('/todos/{id}')
          .withPathParams('id', 1)
          .expectStatus(200)
          .inspect();
      });
      it('Should get one todo failed', () => {
        return pactum
          .spec()
          .get('/todos')
          .withPathParams('id', 100)
          .expectStatus(404)
          .inspect();
      });
    });

    describe('Update  todo', () => {
      it('Should update todo successfully', () => {
        return pactum
          .spec()
          .patch('/todos/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', 1)
          .withBody({
            title: 'update todo 1',
          })
          .expectStatus(200)
          .inspect();
      });

      it('Should update todo failed', () => {
        return pactum
          .spec()
          .patch('/todos/{id}')
          .withPathParams('id', 1)
          .withBody({
            title: 'update todo 1',
          })
          .expectStatus(401)
          .inspect();
      });
    });

    describe('Delete todo', () => {
      it('Should Delete todo successfully', () => {
        return pactum
          .spec()
          .get('/todos/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withPathParams('id', 1)
          .expectStatus(200)
          .inspect();
      });

      it('Should Delete todo failed', () => {
        return pactum
          .spec()
          .get('/todos/{id}')
          .withPathParams('id', 1)
          .expectStatus(200)
          .inspect();
      });
    });
  });
});
