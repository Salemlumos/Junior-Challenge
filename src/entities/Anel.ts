import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import Usuario from '../entities/Usuario';
import Historico from './Historico';

@Entity('aneis')
export default class Anel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome: string = '';

  @Column()
  poder: string = '';

  @Column()
  imagem: string = '';

  @Column()
  descricao: string = '';


  @OneToMany(() => Historico, (historico) => historico.anel, { cascade: ["remove"] })
  historico!: Historico[];

  @ManyToOne(() => Usuario, (usuario) => usuario.portadorAneis)
  portador!: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.forjadoPorAneis)
  forjadoPor!: Usuario;
}