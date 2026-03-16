import { Router, Request, Response } from 'express';
import { RegisterUser } from '@hotel/domain/src/use-cases/RegisterUser';
import { LoginUser } from '@hotel/domain/src/use-cases/LoginUser';
import { UserRepo } from '../repositories/UserRepo';

const router = Router();
const userRepo = new UserRepo();
const registerUser = new RegisterUser(userRepo);
const loginUser = new LoginUser(userRepo);

router.post('/register', async (req:Request, res: Response)=> {
    try {
        const {nombre, email, password} = req.body;
        const user = await registerUser.execute({nombre, email, password});
        res.status(201).json({id: user.id, nombre: user.nombre, email: user.email, role: user.role})
    } catch (error: any) {
        res.status(400).json({error: error.message})
    }
});

router.post('/login', async(req: Request, res: Response)=> {
    try {
        const { email, password } = req.body;
        const result = await loginUser.execute({email, password});
        res.status(201).json({ token: result.token, role: result.user.role });
    } catch (error: any){
        res.status(400).json({error: error.message})
    }
})

export default router;