from django.db import models
import uuid
# Create your models here.
import json

class HostData(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    ip = models.GenericIPAddressField(unique=True, db_index=True)
    name = models.CharField(max_length=50, default='Unknown')
    cpu = models.FloatField()
    mem = models.IntegerField()
    disk = models.IntegerField()
    ts = models.DateTimeField(auto_now=True)

    def toJS(self):
        d = dict([k, v] for k, v in self.__dict__.items() if k in ('ip', 'name', 'cpu', 'mem', 'disk'))
        d['ts'] = self.ts.strftime("%m/%d/%Y, %H:%M:%S")
        return d

    def toJSON(self):
        return json.dumps(self.toJS())
    
    def __str__(self):
        return self.toJSON()
