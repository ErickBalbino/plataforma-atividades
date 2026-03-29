from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.accounts.models import User
from apps.classes.models import ClassRoom
from apps.activities.models import Activity
from apps.submissions.models import Submission

class Command(BaseCommand):
    help = 'Popula o banco de dados com usuários, salas de aula e atividades iniciais'

    def handle(self, *args, **kwargs):
        self.stdout.write('Iniciando o Seed do Banco de Dados...')

        Submission.objects.all().delete()
        Activity.objects.all().delete()
        User.objects.all().delete()
        ClassRoom.objects.all().delete()

        teacher = User.objects.create_user(
            username='professor',
            email='professor@email.com',
            password='123456',
            role='TEACHER'
        )
        self.stdout.write(self.style.SUCCESS('Usuário Professor criado: professor@email.com | 123456'))

        classroom_fullstack = ClassRoom.objects.create(
            name='Sala de Aula 01',
            teacher=teacher
        )
        self.stdout.write(self.style.SUCCESS(f'Sala de aula criada: {classroom_fullstack.name} ({classroom_fullstack.code})'))

        student1 = User.objects.create_user(
            username='aluno',
            email='aluno@email.com',
            password='123456',
            role='STUDENT'
        )
        student2 = User.objects.create_user(
            username='maria',
            email='maria@email.com',
            password='123456',
            role='STUDENT'
        )
        self.stdout.write(self.style.SUCCESS('Usuários Alunos criados: aluno@email.com | 123456'))

        from apps.classes.models import ClassRoomMembership
        ClassRoomMembership.objects.create(classroom=classroom_fullstack, student=student1)
        ClassRoomMembership.objects.create(classroom=classroom_fullstack, student=student2)
        self.stdout.write(self.style.SUCCESS('Alunos vinculados à sala de aula.'))

        activity_open = Activity.objects.create(
            teacher=teacher,
            classroom=classroom_fullstack,
            title='Projeto Frontend com React',
            description='Desenvolva uma tela de listagem de alunos.',
            due_date=timezone.now() + timedelta(days=5)
        )
        
        activity_late = Activity.objects.create(
            teacher=teacher,
            classroom=classroom_fullstack,
            title='Prática Banco de Dados',
            description='Crie a modelagem lógica para um sistema educacional.',
            due_date=timezone.now() - timedelta(days=2)
        )
        self.stdout.write(self.style.SUCCESS('Atividades de exemplo criadas'))

        Submission.objects.create(
            activity=activity_open,
            student=student1,
            content='Aqui está a minha tela construída com Ant Design conforme requisitos da atividade'
        )

        sub_graded = Submission.objects.create(
            activity=activity_late,
            student=student2,
            content='Modelagem lógica encaminhada em anexo (SQL e Diagrama).',
            grade=9.5,
            feedback='Excelente mapeamento e modelagem do sistema'
        )
        sub_graded.turned_in_at = timezone.now() - timedelta(days=3)
        sub_graded.save()

        self.stdout.write(self.style.SUCCESS('Seed Finalizado! O sistema está pronto para navegação.'))
