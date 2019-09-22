from django.db import models

import uuid


class Folder(models.Model):
    name = models.CharField(
        max_length=32,
        verbose_name='Название папки'
    )

    parent_folder = models.ForeignKey(
        'core.Folder',
        related_name='folders',
        null=True,
        blank=True,
        verbose_name='Родительская папка',
        on_delete=models.CASCADE
    )

    key = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        verbose_name='Ключ папки',
    )

    created = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания папки'
    )

    class Meta:
        verbose_name = 'Папка'
        verbose_name_plural = 'Папки'
        ordering = ('id', )

    def __unicode__(self):
        return f'[{self.id}] {self.name}'


class Image(models.Model):
    name = models.CharField(
        max_length=32,
        verbose_name='Название изображения'
    )

    description = models.TextField(
        max_length=1024,
        verbose_name='Описание изображения'
    )

    content = models.ImageField(
        upload_to='images',
        verbose_name='Изображение'
    )

    mime = models.CharField(
        max_length=32,
        verbose_name='MIME-тип источника'
    )

    key = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        verbose_name='Ключ изображения',
    )

    folder = models.ForeignKey(
        Folder,
        related_name='video_parts',
        verbose_name='Папка с изображением',
        on_delete=models.CASCADE
    )

    created = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата загрузки изображения'
    )

    class Meta:
        verbose_name = 'Изображение'
        verbose_name_plural = 'Изображения'
        ordering = ('id', )

    def __unicode__(self):
        return f'[{self.key}] {self.name}'

