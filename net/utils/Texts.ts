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
            'Сперва нужно начать диалог со мной https://t.me/MaiblumeManagerBot'
    }

    public static confirmMarkup(meet: Meeting): string {
        return 'Подтвердить создание собрания?\n' + this.meetMarkupText(meet)
    }

    public static meetMarkupText(meet: Meeting): string {
        return `Дата: ${meet.date.toDateString()}\n` +
            `Время: ${meet.time}\n` +
            `Учасники: ${[...meet.members].join(' ')}\n` +
            `Описание: ${meet.description ?? ''}\n` +
            `Кем создано: ${meet.createdBy ?? 'unknown'}`
    }
}
