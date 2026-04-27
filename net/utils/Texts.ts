import {Meeting} from "../models/Meeting";

export class Texts {
    public static readonly startText: string = 'Привет, я помогу запланировать:\n ' +
        'Запланировать собрание /create_meet\n ' +
        'Просмотреть предстоящие собрания /meetings\n ' +
        'Создать задачу /create_task\n';

    public static flowTexts = {
        date: 'Выберете дату собрания',
        time: 'Введите время встречи, например: 22, или 21:30',
        members: 'Перечислете учасников через пробел используя символ `@`',
        description: 'Введите описание/цели встречи',
        complete: 'Собрание успеешно создано\n ' +
            'Посмотреть список заплпнированых собраний\n/meetings',
    }

    public static meet = {
        remove: 'Собрание успешно удалено',
        cancel: 'Собрание отменено',
        empty: 'Нет активных собраний'
    }

    public static group = {
        invite: 'Привет! Моя цель создавать собрания, задачи и многое другое.\n' +
            'Но сперва нужно начать диалог со мной https://t.me/MaiblumeManagerBot',
    }

    public static validation = {
        invalidName: 'Некорректный формат времени',
        invalidUsername: 'Имя пользователя должно включать `@`'
    }

    public static notifyAboutMeetPrivate(meet: Meeting) {
        return 'Вы были приглашены на собрание' + this.meetMarkupText(meet);
    }

    public static notifyAboutMeetGroup(meet: Meeting) {
        return 'Было создано собрание\n' + this.meetMarkupText(meet);
    }

    public static confirmMarkup(meet: Meeting): string {
        return 'Подтвердить создание собрания?\n' + this.meetMarkupText(meet)
    }

    public static meetMarkupText(meet: Meeting): string {
        const members = meet.members.length
            ? meet.members.join(' ')
            : '-'

        return `Дата: ${meet.date.toDateString()}\n` +
            `Время: ${meet.time}\n` +
            `Учасники: ${members}\n` +
            `Описание: ${meet.description ?? ''}\n` +
            `Кем создано: ${meet.createdBy ?? 'unknown'}`
    }
}
