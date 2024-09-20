import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Anel from './Anel';
import Usuario from './Usuario';

@Entity()
export default class Historico {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Anel, anel => anel.historico)
  anel: Anel = new Anel();

  @ManyToOne(() => Usuario, usuario => usuario.historico)
  usuario!: Usuario;

  @Column()
  action: string = "";  

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date;
}

